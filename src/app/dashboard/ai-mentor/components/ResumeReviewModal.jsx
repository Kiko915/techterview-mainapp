import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

const ResumeReviewModal = ({ open, onOpenChange, defaultTab = "paste", onContextSet }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [pasteText, setPasteText] = useState("");
    const [uploadText, setUploadText] = useState("");
    const [portfolioText, setPortfolioText] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [url, setUrl] = useState("");

    // Reset active tab when defaultTab changes
    React.useEffect(() => {
        if (open) {
            setActiveTab(defaultTab);
        }
    }, [defaultTab, open]);

    const handleScrape = async () => {
        if (!url) return;

        try {
            new URL(url);
        } catch (_) {
            toast.error("Please enter a valid URL");
            return;
        }

        setIsUploading(true);
        try {
            const res = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (!res.ok) throw new Error("Scraping failed");

            const data = await res.json();
            setPortfolioText(data.text);
            toast.success("Portfolio scraped successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to scrape portfolio");
        } finally {
            setIsUploading(false);
        }
    };

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error("Only PDF files are supported");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setUploadText(data.text);
            toast.success("Resume parsed successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to parse resume");
        } finally {
            setIsUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });

    const handleSubmit = () => {
        let finalText = "";
        if (activeTab === "paste") finalText = pasteText;
        else if (activeTab === "upload") finalText = uploadText;
        else if (activeTab === "portfolio") finalText = portfolioText;

        if (!finalText.trim()) {
            toast.error("Please provide content");
            return;
        }
        onContextSet(finalText);
        onOpenChange(false);
        toast.success("Context added to chat!");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Context</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="paste">Paste Text</TabsTrigger>
                        <TabsTrigger value="upload">Upload PDF</TabsTrigger>
                        <TabsTrigger value="portfolio">Portfolio Link</TabsTrigger>
                    </TabsList>

                    <TabsContent value="paste" className="mt-4">
                        <Textarea
                            placeholder="Paste your resume content here..."
                            className="min-h-[200px]"
                            value={pasteText}
                            onChange={(e) => setPasteText(e.target.value)}
                        />
                    </TabsContent>

                    <TabsContent value="upload" className="mt-4">
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
              `}
                        >
                            <input {...getInputProps()} />
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <p>Parsing PDF...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                    <p>Drag & drop your PDF resume here, or click to select</p>
                                    <p className="text-xs text-muted-foreground">PDF only, max 5MB</p>
                                </div>
                            )}
                        </div>
                        {uploadText && (
                            <div className="mt-4">
                                <p className="text-sm font-medium mb-2">Parsed Content Preview:</p>
                                <div className="bg-muted p-3 rounded-md max-h-[100px] overflow-y-auto text-xs text-muted-foreground">
                                    {uploadText}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="portfolio" className="mt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Portfolio URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        placeholder="https://your-portfolio.com"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                    <Button onClick={handleScrape} disabled={!url || isUploading}>
                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
                                    </Button>
                                </div>
                            </div>
                            {portfolioText && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium mb-2">Scraped Content Preview:</p>
                                    <div className="bg-muted p-3 rounded-md max-h-[150px] overflow-y-auto text-xs text-muted-foreground">
                                        {portfolioText}
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end mt-4">
                    <Button onClick={handleSubmit} disabled={isUploading}>
                        Add to Chat
                    </Button>
                </div>
            </DialogContent>
        </Dialog >
    );
};

export default ResumeReviewModal;
