import { useEffect } from 'react';
import CreativeStudio from '../CreativeStudio';

export default function StudioScreen() {
    useEffect(() => {
        document.title = 'DesignDNA — Studio';
    }, []);

    return (
        <CreativeStudio
            analysisResult={null}
            uploadedImage={null}
            onNavigate={() => { }}
        />
    );
}
