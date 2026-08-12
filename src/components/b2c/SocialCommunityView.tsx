import React, { useState } from "react";
import { useHomeli } from "../../context/HomeliContext";
import { Post } from "../../types";
import { MessageSquare, Heart, Share2, Sparkles, Send, PlusCircle, User, Image, Check } from "lucide-react";

export const SocialCommunityView: React.FC = () => {
  const { posts, addPost, toggleLikePost, addCommentToPost, user, setIsAIAssistantOpen } = useHomeli();
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Post["category"]>("Pregunta local");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    addPost(newPostContent, selectedCategory);
    setNewPostContent("");
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addCommentToPost(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sky-600" />
            Comunidad Social Homeli
          </h2>
          <p className="text-xs text-slate-500">Publicaciones, dudas locales y recomendaciones entre vecinos</p>
        </div>

        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-violet-100 border border-violet-200 text-violet-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-violet-200"
        >
          <Sparkles className="w-3.5 h-3.5" /> IA Bot
        </button>
      </div>

      {/* New Post Creator Box */}
      <form onSubmit={handleCreatePost} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
        <div className="flex items-start gap-3">
          <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
          <textarea
            rows={2}
            placeholder="Escribe una pregunta local o recomendación..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Post["category"])}
            className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
          >
            <option value="Pregunta local">Pregunta local</option>
            <option value="Recomendación">Recomendación</option>
            <option value="Oferta">Oferta</option>
            <option value="Anuncio">Anuncio</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" /> Publicar
          </button>
        </div>
      </form>

      {/* Posts Stream */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            
            {/* Author Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    {post.authorName}
                    {post.isSponsored && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-bold">
                        PUB
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">{post.authorRole} • {post.timestamp}</div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-medium">
                {post.category}
              </span>
            </div>

            {/* Post Content */}
            <p className="text-xs text-slate-800 leading-relaxed">{post.content}</p>

            {post.image && (
              <div className="rounded-xl overflow-hidden border border-slate-200 max-h-60 bg-slate-100">
                <img src={post.image} alt="Post media" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <button
                onClick={() => toggleLikePost(post.id)}
                className={`flex items-center gap-1.5 font-semibold transition-colors ${
                  post.isLiked ? "text-rose-500" : "hover:text-slate-900"
                }`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{post.likes}</span>
              </button>

              <div className="flex items-center gap-1.5 font-semibold">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <span>{post.commentsCount} comentarios</span>
              </div>
            </div>

            {/* Comments Stream */}
            {post.comments.length > 0 && (
              <div className="space-y-2 pt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {post.comments.map((comm) => (
                  <div key={comm.id} className="text-xs">
                    <span className="font-bold text-slate-900 mr-2">{comm.author}:</span>
                    <span className="text-slate-700">{comm.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Escribe un comentario..."
                value={commentInputs[post.id] || ""}
                onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
              />
              <button
                onClick={() => handleAddComment(post.id)}
                className="px-3 py-1.5 rounded-xl bg-sky-100 text-sky-800 hover:bg-sky-200 font-semibold text-xs border border-sky-200"
              >
                Comentar
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
