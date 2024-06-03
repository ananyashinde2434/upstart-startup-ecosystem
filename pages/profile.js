import Layout from "../components/Layout";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import Link from "next/link";
import PostCard from "../components/PostCard";
import {useRouter} from "next/router";
import FriendInfo from "../components/FriendInfo";
import {useEffect, useState} from "react";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import Cover from "../components/Cover";
import ProfileTabs from "../components/ProfileTabs";
import ProfileContent from "../components/ProfileContent";
import {UserContextProvider} from "../contexts/UserContext";

export default function ProfilePage() {
  const [profile,setProfile] = useState(null);
  const [editMode,setEditMode] = useState(false);
  const [name,setName] = useState('');
  const [place,setPlace] = useState('');
  const router = useRouter();
  const {asPath:pathname} = router;
  const isPosts = pathname.includes('posts') || pathname === '/profile';
  const isAbout = pathname.includes('about');
  const isFriends = pathname.includes('friends');
  const isPhotos = pathname.includes('photos');
  const tabClasses = 'flex gap-1 px-4 py-1 items-center border-b-4 border-b-white';
  const activeTabClasses = 'flex gap-1 px-4 py-1 items-center border-socialBlue border-b-4 text-socialBlue font-bold';
  const tab = router?.query?.tab?.[0] || 'posts';
  const session = useSession();
  const userId = router.query.id;

  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchUser();
  }, [userId]);

  function fetchUser() {
    supabase.from('profiles')
      .select()
      .eq('id', userId)
      .then(result => {
        if (result.error) {
          throw result.error;
        }
        if (result.data) {
          setProfile(result.data[0]);
        }
      });
  }

  function saveProfile() {
    supabase.from('profiles')
      .update({
        name,
        place,
      })
      .eq('id', session.user.id)
      .then(result => {
        if (!result.error) {
          setProfile(prev => ({...prev,name,place}));
        }
        setEditMode(false);
      });
  }


  const isMyUser = userId === session?.user?.id;

  return (
    <Layout>
      <Card noPadding={true}>
        <div className="relative overflow-hidden rounded-md">
          <div className="h-36 overflow-hidden flex justify-center items-center">
            <img src="https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt=""/>
          </div>
          <div className="absolute top-24 left-4">
            <Avatar size={'lg'} />
          </div>
          <div className="p-4 pt-0 md:pt-4 pb-0">
            <div className="ml-24 md:ml-40">
              <h1 className=" text-3xl font-bold">
                John Doe
              </h1>
              <div className="text-gray-500 leading-4">Stockholm, Sweden</div>
              </div>
            </div>
        </div>
      <UserContextProvider>
        <Card noPadding={true}>
          <div className="relative overflow-hidden rounded-md">
            <Cover url={profile?.cover} editable={isMyUser} onChange={fetchUser} />
            <div className="absolute top-24 left-4 z-20">
              {profile && (
                <Avatar url={profile.avatar} size={'lg'} editable={isMyUser} onChange={fetchUser} />
              )}
            </div>
            <div className="mt-4 md:mt-10 flex gap-0">
              <Link href={'/profile/posts'} className={isPosts ? activeTabClasses : tabClasses}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="hidden sm:block">Posts</span>
              </Link>
              <Link href={'/profile/about'} className={isAbout ? activeTabClasses : tabClasses}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <span className="hidden sm:block">About</span>
              </Link>
              <Link href={'/profile/friends'} className={isFriends ? activeTabClasses : tabClasses}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <span className="hidden sm:block">Friends</span>
              </Link>
              <Link href={'/profile/photos'} className={isPhotos ? activeTabClasses : tabClasses}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span className="hidden sm:block">Photos</span>
              </Link>
            </div>
          </div>
          </Card>
      </UserContextProvider>
      {isPosts && (
        <div>
          <PostCard />
        </div>
      )}
      {isAbout && (
        <div>
          <Card>
            <h2 className="text-3xl mb-2">About me</h2>
            <p className="mb-2 text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut doloremque harum maxime mollitia perferendis praesentium quaerat. Adipisci, delectus eum fugiat incidunt iusto molestiae nesciunt odio porro quae quaerat, reprehenderit, sed.</p>
            <p className="mb-2 text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet assumenda error necessitatibus nesciunt quas quidem quisquam reiciendis, similique. Amet consequuntur facilis iste iure minima nisi non praesentium ratione voluptas voluptatem?</p>
          </Card>
        </div>
      )}
      {isFriends && (
        <div>
          <Card>
            <h2 className="text-3xl mb-2">Friends</h2>
            <div className="">
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
                </div>
            <div className="p-4 pt-0 md:pt-4 pb-0">
              <div className="ml-24 md:ml-40 flex justify-between">
                <div>
                  {editMode && (
                    <div>
                      <input type="text"
                             className="border py-2 px-3 rounded-md"
                             placeholder={'Your name'}
                             onChange={ev => setName(ev.target.value)}
                             value={name}/>
                    </div>
                  )}
                  {!editMode && (
                    <h1 className="text-3xl font-bold">
                      {profile?.name}
                    </h1>
                  )}
                  {!editMode && (
                    <div className="text-gray-500 leading-4">
                      {profile?.place || 'Internet'}
                    </div>
                  )}
                  {editMode && (
                    <div>
                      <input type="text"
                             className="border py-2 px-3 rounded-md mt-1"
                             placeholder={'Your location'}
                             onChange={ev => setPlace(ev.target.value)}
                             value={place}/>
                    </div>
                  )}
                </div>
                <div className="grow">
                  <div className="text-right">
                    {isMyUser && !editMode && (
                      <button
                        onClick={() => {
                          setEditMode(true);
                          setName(profile.name);
                          setPlace(profile.place);
                        }}
                        className="inline-flex mx-1 gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit profile
                      </button>
                    )}
                    {isMyUser && editMode && (
                      <button onClick={saveProfile} className="inline-flex mx-1 gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2">
                        Save profile
                      </button>
                    )}
                    {isMyUser && editMode && (
                      <button onClick={() => setEditMode(false)} className="inline-flex mx-1 gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <ProfileTabs active={tab} userId={profile?.id} />
          </div>
          </div>
          </Card>
      ){"}"}
      {isPhotos && (
        <div>
          <Card>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-md overflow-hidden h-48 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1601581875039-e899893d520c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" alt=""/>
              </div>
              <div className="rounded-md overflow-hidden h-48 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1563789031959-4c02bcb41319?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" alt=""/>
              </div>
              <div className="rounded-md overflow-hidden h-48 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1560703650-ef3e0f254ae0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt=""/>
              </div>
              <div className="rounded-md overflow-hidden h-48 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1601581874834-3b6065645e07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" alt=""/>
              </div>
            </div>
          </Card>
        </div>
        )}
          </div>
      )
    }</Card>
        <ProfileContent activeTab={tab} userId={userId} />
        </Layout>
  )
}