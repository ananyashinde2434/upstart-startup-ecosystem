import Avatar from "./Avatar";
import Card from "./Card";
import ClickOutHandler from 'react-clickout-handler';
import {useState, useEffect, useContext} from "react";
import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import {UserContext} from "../contexts/UserContext";
import {useSupabaseClient} from "@supabase/auth-helpers-react";

export default function PostCard({id, content, created_at, photos, profiles: authorProfile}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const {profile: myProfile} = useContext(UserContext);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (myProfile?.id) {
      fetchLikes();
      fetchComments();
      fetchIsSaved();
    }
  }, [myProfile?.id]);

  function fetchIsSaved() {
    supabase
      .from('saved_posts')
      .select()
      .eq('post_id', id)
      .eq('user_id', myProfile?.id)
      .then(result => {
        setIsSaved(result.data.length > 0);
      })
      .catch(error => {
        console.error('Error fetching saved status:', error);
      });
  }

  function fetchLikes() {
    supabase.from('likes')
      .select()
      .eq('post_id', id)
      .then(result => {
        setLikes(result.data);
      })
      .catch(error => {
        console.error('Error fetching likes:', error);
      });
  }

  function fetchComments() {
    supabase.from('posts')
      .select('*, profiles(*)')
      .eq('parent', id)
      .then(result => {
        setComments(result.data);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
  }

  function openDropdown(e) {
    e.stopPropagation();
    setDropdownOpen(true);
  }

  function handleClickOutsideDropdown() {
    setDropdownOpen(false);
  }

  function toggleSave() {
    if (isSaved) {
      supabase.from('saved_posts')
        .delete()
        .eq('post_id', id)
        .eq('user_id', myProfile?.id)
        .then(() => {
          setIsSaved(false);
          setDropdownOpen(false);
        })
        .catch(error => {
          console.error('Error unsaving post:', error);
        });
    } else {
      supabase.from('saved_posts')
        .insert({
          user_id: myProfile.id,
          post_id: id,
        })
        .then(() => {
          setIsSaved(true);
          setDropdownOpen(false);
        })
        .catch(error => {
          console.error('Error saving post:', error);
        });
    }
  }

  const isLikedByMe = !!likes.find(like => like.user_id === myProfile?.id);

  function toggleLike() {
    if (isLikedByMe) {
      supabase.from('likes')
        .delete()
        .eq('post_id', id)
        .eq('user_id', myProfile.id)
        .then(fetchLikes)
        .catch(error => {
          console.error('Error unliking post:', error);
        });
    } else {
      supabase.from('likes')
        .insert({
          post_id: id,
          user_id: myProfile.id,
        })
        .then(fetchLikes)
        .catch(error => {
          console.error('Error liking post:', error);
        });
    }
  }

  function postComment(ev) {
    ev.preventDefault();
    supabase.from('posts')
      .insert({
        content: commentText,
        author: myProfile.id,
        parent: id,
      })
      .then(() => {
        fetchComments();
        setCommentText('');
      })
      .catch(error => {
        console.error('Error posting comment:', error);
      });
  }

  return (
    <Card>
      <div className="flex gap-3">
        <div>
          <Link href={`/profile/${authorProfile.id}`}>
            <a className="cursor-pointer">
              <Avatar url={authorProfile.avatar} />
            </a>
          </Link>
        </div>
        <div className="grow">
          <p>
            <Link href={`/profile/${authorProfile.id}`}>
              <a className="mr-1 font-semibold cursor-pointer hover:underline">
                {authorProfile.name}
              </a>
            </Link>
            shared a <span className="text-socialBlue">post</span>
          </p>
          <p className="text-gray-500 text-sm">
            <ReactTimeAgo date={(new Date(created_at)).getTime()} />
          </p>
        </div>
        <div className="relative">
          <button className="text-gray-400" onClick={openDropdown}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </button>
          <ClickOutHandler onClickOut={handleClickOutsideDropdown}>
            <div className="relative">
              {dropdownOpen && (
                <div className="absolute -right-6 bg-white shadow-md shadow-gray-300 p-3 rounded-sm border border-gray-100 w-52">
                  <button
                    onClick={toggleSave}
                    className="flex gap-3 py-2 my-2 hover:bg-socialBlue hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 w-full"
                  >
                    {isSaved ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                        />
                      </svg>
                    )}
                    {isSaved ? 'Remove from saved' : 'Save post'}
                  </button>
                  <a
                    href="#"
                    className="flex gap-3 py-2 my-2 hover:bg-socialBlue hover:text-white -mx-4 px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5."
                      />
                    </svg>
                    Share
                  </a>
                </div>
              )}
            </div>
          </ClickOutHandler>
        </div>
      </div>
  
      {/* Comment section */}
      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center mb-2">
            <Avatar url={comment.profiles.avatar} />
            <p className="ml-2">{comment.content}</p>
          </div>
        ))}
        <form onSubmit={postComment} className="mt-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Write a comment..."
          />
          <button type="submit" className="bg-socialBlue text-white px-4 py-2 rounded-md mt-2">
            Post
          </button>
        </form>
      </div>
    </Card>
  );
}
  


