"use client";

import React from 'react';
import {useRouter} from "next/navigation";
import Heading from "@/app/components/Heading";
import Button from "@/app/components/Button";

interface EmptyStateProps {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title="No exact matches", showReset, subtitle="Try removing or changing some of your filters." }) => {
    const router = useRouter();

    return (
        <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
            <Heading title={title} subtitle={subtitle} center />
            <div className="w-48 mt-4">
                {
                    showReset && (
                        <Button label="Remove all filters" onClick={() => router.push('/')} outline />
                    )
                }
            </div>
        </div>
    );
};

export default EmptyState;