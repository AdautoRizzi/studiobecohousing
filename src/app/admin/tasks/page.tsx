import React from 'react';
import { getTwelveWeeksPlan } from '@/lib/db';
import TwelveWeekBoard from '@/components/crm/TwelveWeekBoard';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
    const plan = await getTwelveWeeksPlan();
    return <TwelveWeekBoard initialPlan={plan} />;
}
