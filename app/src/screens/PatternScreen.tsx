import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../components/shared';
import LibraryScreen from './LibraryScreen';
import PatternDetailScreen from './PatternDetailScreen';
import CompareScreen from './CompareScreen';

// ── Nested Route Shell ─────────────────────────────────────────────

export default function PatternScreen() {
    return (
        <Routes>
            <Route index element={<PatternListView />} />
            <Route path="compare" element={<CompareScreen />} />
            <Route path=":id" element={<PatternDetailScreen />} />
        </Routes>
    );
}

// ── Pattern List View ──────────────────────────────────────────────
// Wraps LibraryScreen + "Compare Designs" accent CTA header

function PatternListView() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'DesignDNA — Patterns';
    }, []);

    return (
        <div className="max-w-[960px] mx-auto">
            {/* Title + CTA — same row */}
            <div className="flex items-center justify-between pt-8 mb-6">
                <div>
                    <h1 className="text-[32px] font-bold tracking-tight mb-1">Patterns</h1>
                </div>
                <Button
                    variant="accent"
                    onClick={() => navigate('/pattern/compare')}
                    className="flex items-center gap-2 flex-shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Compare Designs
                </Button>
            </div>
            <LibraryScreen hideTitle />
        </div>
    );
}
