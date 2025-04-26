
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image first!",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:5001/predict", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.prediction);
      toast({
        title: "Success!",
        description: "Image processed successfully.",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Error during prediction. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Landcover Classification
            </CardTitle>
            <CardDescription className="text-center">
              Upload an image to classify its landcover type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-md">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {preview && (
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-md h-auto object-cover"
                  />
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full max-w-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Analyze Image"
                )}
              </Button>

              {result && (
                <Card className="w-full max-w-md bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-xl">Prediction Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium text-center">{result}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
