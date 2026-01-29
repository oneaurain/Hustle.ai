export interface NotificationTemplate {
    id: string;
    title: string;
    body: string;
    type: 'motivation' | 'quest' | 'earnings' | 'system' | 'streak';
}

export const NOTIFICATION_TYPES: NotificationTemplate[] = [
    // --- Motivation & engagement (1-6) ---
    { id: 'daily_motivation_1', title: 'Time to Hustle! 💪', body: 'The early bird gets the worm. Check out new quests today!', type: 'motivation' },
    { id: 'daily_motivation_2', title: 'Goals Waiting 🎯', body: 'You set big goals. Take one small step today to reach them.', type: 'motivation' },
    { id: 'weekend_hustle', title: 'Weekend Warrior ⚔️', body: 'Weekends are perfect for side quests. See what\'s available.', type: 'motivation' },
    { id: 'evening_check', title: 'Free evening? 🌙', body: 'Turn your downtime into dollar signs. Quick tasks available.', type: 'motivation' },
    { id: 'streak_danger', title: 'Streak at Risk! 🔥', body: 'You haven\'t logged in today. Don\'t lose your 5-day streak!', type: 'streak' },
    { id: 'streak_reward', title: 'Streak Bonus Unlocked 🎁', body: 'Great job maintaining your streak! Claim your XP bonus.', type: 'streak' },

    // --- Quests & Opportunities (7-15) ---
    { id: 'new_quest_alert', title: 'New Quest Match 🕵️', body: 'A new quest matches your "Design" skills. Check it out!', type: 'quest' },
    { id: 'high_paying_alert', title: 'High Reward Alert 💰', body: 'We found a quest with high earning potential near you.', type: 'quest' },
    { id: 'quick_win', title: 'Quick Win Available ⚡', body: 'Have 15 mins? Complete this quick survey quest for instant XP.', type: 'quest' },
    { id: 'quest_expiring', title: 'Quest Expiring ⏳', body: 'The "Logo Design" quest expires in 2 hours. Don\'t miss out.', type: 'quest' },
    { id: 'quest_reminder', title: 'Finish What You Started 🏎️', body: 'You have an active quest in progress. Complete it to get paid.', type: 'quest' },
    { id: 'trending_hustle', title: 'Trending Hustle 📈', body: 'Everyone is doing "UGC Content" right now. Learn how to start.', type: 'quest' },
    { id: 'skill_match', title: 'Put your Skills to Use 🧠', body: 'Your "Writing" skill is in high demand today.', type: 'quest' },
    { id: 'local_gig', title: 'Gig Near You 📍', body: 'Someone nearby needs help with "Dog Walking". Interested?', type: 'quest' },
    { id: 'collab_invite', title: 'Collaboration Invite 🤝', body: 'Another user wants to team up on a quest.', type: 'quest' },

    // --- Earnings & Finance (16-22) ---
    { id: 'payment_received', title: 'Ka-ching! 💸', body: 'You just marked a quest as paid. Great work!', type: 'earnings' },
    { id: 'weekly_report', title: 'Weekly Earnings Report 📊', body: 'You made $150 this week. See your full breakdown.', type: 'earnings' },
    { id: 'goal_milestone', title: 'Halfway There! 🏔️', body: 'You reached 50% of your "MacBook Pro" savings goal.', type: 'earnings' },
    { id: 'first_dollar', title: 'First Dollar Earned 💵', body: 'Congratulations on your first earnings! This is just the start.', type: 'earnings' },
    { id: 'monthly_summary', title: 'Monthly Wrap-up 🗓️', body: 'Check out your total side hustle income for January.', type: 'earnings' },
    { id: 'tax_tip', title: 'Tax Tip 💡', body: 'Did you save a percentage for taxes? Read our guide.', type: 'earnings' },
    { id: 'expense_alert', title: 'Track Your Expenses 📉', body: 'Don\'t forget to log any costs for your recent quest.', type: 'earnings' },

    // --- System & Profile (23-30) ---
    { id: 'profile_complete', title: 'Profile Incomplete 👤', body: 'Add your skills to get better quest recommendations.', type: 'system' },
    { id: 'level_up', title: 'Level Up! 🌟', body: 'You reached Level 5! New features unlocked.', type: 'system' },
    { id: 'badge_earned', title: 'New Badge Unlocked 🏆', body: 'You earned the "Reliable" badge for completing 5 quests.', type: 'system' },
    { id: 'security_alert', title: 'Login Alert 🛡️', body: 'New login detected on your account.', type: 'system' },
    { id: 'app_update', title: 'New Features Available 🚀', body: 'Update SideQuest to access the new Freelance Marketplace.', type: 'system' },
    { id: 'rate_us', title: 'Enjoying SideQuest? ⭐', body: 'Please take a moment to rate us on the App Store.', type: 'system' },
    { id: 'feedback_request', title: 'We Value Your Opinion 🗣️', body: 'How was your last quest? Let us know.', type: 'system' },
    { id: 'welcome_back', title: 'Welcome Back! 👋', body: 'We missed you. Ready to pick up where you left off?', type: 'system' },
];
