import { Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/shared';

interface AnalyzeGoToStudioButtonProps {
    uploadedImage: { data: string; name: string } | null;
    analysisResult: any;
}

export function AnalyzeGoToStudioButton({
    uploadedImage,
    analysisResult,
}: AnalyzeGoToStudioButtonProps) {
    const navigate = useNavigate();

    return (
        <Button
            variant="accent"
            onClick={() => navigate('/studio', {
                state: {
                    analysisResult,
                    uploadedImage: uploadedImage ? {
                        data: uploadedImage.data,
                        name: uploadedImage.name,
                        type: 'image/png',
                    } : null,
                },
            })}
        >
            <Palette className="w-4 h-4" />
            Remix this in Studio
        </Button>
    );
}
