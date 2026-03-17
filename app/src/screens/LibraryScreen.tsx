import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatternLibrary from '../PatternLibrary';

export default function LibraryScreen() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'DesignDNA — Library';
    }, []);

    const handleNavigate = (screen: string, data?: any) => {
        if (screen === 'pattern_detail' && data?.patternId) {
            navigate(`/library/pattern/${data.patternId}`);
        } else if (screen === 'upload') {
            navigate('/analyze');
        } else {
            // Fallback
            navigate('/');
        }
    };

    return <PatternLibrary onNavigate={handleNavigate} />;
}
