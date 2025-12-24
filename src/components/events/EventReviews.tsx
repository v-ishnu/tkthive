import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';

const INITIAL_REVIEWS = [
    {
        id: 1,
        user: "Sarah Jenkins",
        date: "2 hours ago",
        rating: 5,
        text: "The production quality was absolutely mind-blowing! The sound engineering team deserves a raise. One of the best live events I've attended this year.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
    },
    {
        id: 2,
        user: "Marcus Chen",
        date: "5 hours ago",
        rating: 4,
        text: "Great atmosphere and crowd energy. Entry process was smooth, but the food stalls had really long queues. Recommend arriving early next time.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
    },
    {
        id: 3,
        user: "Emily Watson",
        date: "1 day ago",
        rating: 5,
        text: "Loved the VIP lounge experience. The exclusive meet-and-greet with the artists made it totally worth the extra price.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
    },
    {
        id: 4,
        user: "David Miller",
        date: "2 days ago",
        rating: 4,
        text: "Solid lineup and great venue choice. Parking was a bit of a hassle, but everything else was perfect.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
    }
];

export function EventReviews() {
    const [reviews, setReviews] = useState(INITIAL_REVIEWS);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating === 0 || !newComment.trim()) return;

        setIsSubmitting(true);

        // Simulate network delay
        setTimeout(() => {
            const newReview = {
                id: Date.now(),
                user: "You",
                date: "Just now",
                rating: newRating,
                text: newComment,
                avatar: "https://ui-avatars.com/api/?name=You&background=random" // Placeholder for current user
            };

            setReviews([newReview, ...reviews]);
            setNewRating(0);
            setNewComment("");
            setIsSubmitting(false);
        }, 600);
    };

    return (
        <section className="mt-16 pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <MessageSquare className="text-amber-400" />
                Comments & Reviews <span className="text-zinc-500 text-lg">({reviews.length})</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Review List */}
                <div className="lg:col-span-2 space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                                    <img src={review.avatar} alt={review.user} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-white text-base">{review.user}</h4>
                                        <span className="text-xs text-zinc-500 font-medium">{review.date}</span>
                                    </div>
                                    <div className="flex bg-black/20 px-2 py-1 rounded-lg gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-zinc-300 text-sm leading-relaxed">
                                    "{review.text}"
                                </p>
                            </div>
                        </div>
                    ))}

                    <button className="w-full py-3 text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 border border-dashed border-white/10 rounded-xl transition-all">
                        Load More Reviews
                    </button>
                </div>

                {/* Write Review Form */}
                <div className="h-fit bg-card border border-white/10 rounded-3xl p-6 sticky top-24">
                    <h3 className="font-bold text-white mb-4 text-lg">Leave a Review</h3>
                    <p className="text-sm text-zinc-400 mb-6">Share your experience with other attendees.</p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setNewRating(star)}
                                        className="text-zinc-600 hover:text-amber-400 transition-colors focus:outline-none"
                                    >
                                        <Star
                                            size={28}
                                            className={`${newRating >= star ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'} transition-all hover:scale-110`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Your Review</label>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 text-sm transition-colors resize-none"
                                rows={4}
                                placeholder="Tell us about your experience..."
                                required
                            />
                        </div>

                        <button
                            disabled={isSubmitting || newRating === 0 || !newComment.trim()}
                            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            <Send size={16} className={isSubmitting ? 'animate-pulse' : ''} />
                            {isSubmitting ? 'Posting...' : 'Post Review'}
                        </button>
                    </form>
                </div>

            </div>
        </section>
    );
}
