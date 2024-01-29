import React, { useState } from 'react';

const CommentList = () => {
  const [comments, setComments] = useState([
    { id: 1, content: '留言1', timestamp: '2024-01-09 12:00:00', showDropdown: false, editMode: false },
    { id: 2, content: '留言2', timestamp: '2024-01-09 12:30:00', showDropdown: false, editMode: false },
    { id: 3, content: '留言3', timestamp: '2024-01-09 13:00:00', showDropdown: false, editMode: false },
  ]);
  const [newComment, setNewComment] = useState('');

  const toggleDropdown = (commentId) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId ? { ...comment, showDropdown: !comment.showDropdown } : { ...comment, showDropdown: false }
    );
    setComments(updatedComments);
  };

  const handleEdit = (commentId) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId ? { ...comment, editMode: true, showDropdown: false } : { ...comment, showDropdown: false }
    );
    setComments(updatedComments);
  };

  const handleDelete = (commentId) => {
    const updatedComments = comments.filter((comment) => comment.id !== commentId);
    setComments(updatedComments);
  };

  const handleSaveEdit = (commentId, newText) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId ? { ...comment, content: newText, editMode: false } : comment
    );
    setComments(updatedComments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      const newId = comments.length + 1;
      const currentDate = new Date().toLocaleString();
      const newCommentObj = {
        id: newId,
        content: newComment,
        timestamp: currentDate,
        showDropdown: false,
        editMode: false,
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} />
        <button type="submit">新增留言</button>
      </form>
      {comments.map((comment) => (
        <div key={comment.id} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
          <p>ID: {comment.id}</p>
          <p>{comment.content}</p>
          <p>留言時間: {comment.timestamp}</p>
          <div>
            {comment.showDropdown ? (
              <div>
                <button onClick={() => toggleDropdown(comment.id)}>btn</button>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button onClick={() => handleEdit(comment.id)}>编辑</button>
                  <button onClick={() => handleDelete(comment.id)}>删除</button>
                </div>
              </div>
            ) : (
              <button onClick={() => toggleDropdown(comment.id)}>btn</button>
            )}
            {comment.editMode && (
              <button onClick={() => handleSaveEdit(comment.id, comment.content)}>保存</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
