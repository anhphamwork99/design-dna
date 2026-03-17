import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatternDetail from '../PatternDetail';

export default function PatternDetailScreen() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'DesignDNA — Pattern Detail';
    }, []);

    if (!id) return null;

    return (
        <PatternDetail
            patternId={id}
            onNavigate={(screen: string) => {
                if (screen === 'pattern_library' || screen === 'upload') {
                    navigate('/library');
                } else {
                    navigate('/');
                }
            }}
        />
    );
}
