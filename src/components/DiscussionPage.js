import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, push as firebasePush } from 'firebase/database';
import LikeDislike from './LikeDislike';

function Search(props) {
    return (
        <section className="search-box-area">
            <div className="container">
                <h2>Discussion</h2>
                <div className="search-box">
                    <select name="selection">
                        <option value="Everything">Everything</option>
                        <option value="Titles">Titles</option>
                        <option value="Descriptions">Descriptions</option>
                    </select>
                    <input type="text" name="q" placeholder="Search ..." />
                    <button aria-label="Search"><i className="fa fa-search" aria-hidden="true"></i></button>
                </div>
            </div>
        </section>
    );
}

function RenderAllPost(props) {
    const postDatabase = props.postList;
    const allDiscussionPosts = postDatabase.map((singlePost) => {
        return renderSinglePost(singlePost, props);
    })
    return allDiscussionPosts;
}

function renderSinglePost(singlePost, props) {
    const { userId, userName, userImg, userRole, numPosts, totalPoints, timestamp, topic, post, likes, dislikes } = singlePost;
    return (
        <section className="post-area" key={timestamp + userId}>
            <div className="container">
                <div className="head">
                    <div className="content">Topic: {topic}</div>
                </div>
                <div className="body">
                    <div className="authors">
                        <div className="username">Author: <u>{userName}</u></div>
                        <div>Role: {userRole}</div>
                        <img src={userImg} alt={userName + ' avatar'} />
                        <div>Posts: <u>{numPosts}</u></div>
                        <div>Points: <u>{totalPoints}</u></div>
                    </div>
                    <div className="content">
                        <p>{post}</p>
                        <LikeDislike post={{ likes, dislikes }} onLikePost={() => props.onReaction(singlePost, 'like')} onDislikePost={() => props.onReaction(singlePost, 'dislike')} />
                        <div className='reply'>
                            <div><textarea className='container-fluid' name='reply' rows='3' placeholder='Reply to Post'></textarea></div>
                            <button>
                                <span className="material-symbols-outlined">reply</span> Reply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CreateDiscussionPost(props) {
    const [input, setInput] = useState('');

    const currentUser = props.currentUser;
    const createNewPost = props.makePostCallback;

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInput(values => ({ ...values, [name]: value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        createNewPost(input.topic, input.post);
        setInput('')
    }

    return (
        <section className='post-area'>
            <div className='container-submit'>
                <form className='discussion-post-submit' onSubmit={handleSubmit}>
                    <h2>Create a new Post</h2>
                    {'Posting as: ' + currentUser.userName}
                    <div><textarea className='container-fluid' name='topic' rows='1' placeholder='Type a topic' onChange={handleChange}></textarea></div>
                    <div><textarea className='container-fluid' name='post' rows='5' placeholder='Type a new post' onChange={handleChange}></textarea></div>
                    <button className='btn btn-secondary' type='submit'>
                        Submit
                    </button>
                </form>
            </div>
        </section>
    )
}

export default function DiscussionPage(props) {
    const [discussionPosts, setDiscussionPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [dislikedPosts, setDislikedPosts] = useState([]);
    const currentUser = props.currentUser;

    useEffect(() => {
        const db = getDatabase();
        const postsRef = ref(db, 'discussion_log');

        const offFunction = onValue(postsRef, (snapshot) => {
            const postDatabase = snapshot.val();
            const postId = Object.keys(postDatabase);
            const listOfPosts = postId.map((key) => {
                const discussionPost = postDatabase[key];
                discussionPost.key = key;
                return discussionPost;
            })
            setDiscussionPosts(listOfPosts);
        })

        function cleanup() {
            offFunction();
        }
        return cleanup;
    }, [])

    const createPost = (topic, userText) => {
        if (userText !== undefined && topic !== undefined) {
            const userObj = currentUser;
            const newPost = {
                "userId": userObj.userId,
                "userName": userObj.userName,
                "userImg": userObj.userImg,
                "userRole": ((userObj.userRole === undefined) ? '' : userObj.userRole),
                "timestamp": Date.now(),
                "topic": topic,
                "post": userText,
                "likes": 0,
                "dislikes": 0
            }
            const db = getDatabase();
            const discussions = ref(db, 'discussion_log');
            const updateDiscussion = [...discussionPosts, newPost];
            setDiscussionPosts(updateDiscussion);
            firebasePush(discussions, newPost);
        }
    }

    const handleReaction = (post, reaction) => {
        if (reaction === 'like') {
            setLikedPosts([...likedPosts, post]);
        } else if (reaction === 'dislike') {
            setDislikedPosts([...dislikedPosts, post]);
        }
    }

    return (
        <div>
            <Search setLikedPosts={setLikedPosts} currentUser={currentUser} likedPosts={likedPosts} dislikedPosts={dislikedPosts} />
            <RenderAllPost postList={discussionPosts} likedPosts={likedPosts} dislikedPosts={dislikedPosts} onReaction={handleReaction}/>
            <CreateDiscussionPost currentUser={currentUser} makePostCallback={createPost} />
        </div>
    )
}