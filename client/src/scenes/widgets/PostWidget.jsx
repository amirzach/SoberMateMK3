import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { 
  Box, 
  Divider, 
  IconButton, 
  Typography, 
  useTheme,
  InputBase,
  Button
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:5000/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleComment = async () => {
    const response = await fetch(
      `http://localhost:5000/posts/${postId}/comment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loggedInUserId,
          comment: comment
        }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setComment("");
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:5000/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${comment.userId}-${i}`}>
              <Divider />
              <Box p="1rem" display="flex" alignItems="flex-start" gap="1rem">
                <img
                  style={{
                    objectFit: "cover",
                    borderRadius: "50%",
                    width: "45px",
                    height: "45px",
                  }}
                  alt="user"
                  src={`http://localhost:5000/assets/${comment.userPicturePath}`}
                />
                <Box>
                  <Typography color={main} fontWeight="500">
                    {`${comment.firstName} ${comment.lastName}`}
                  </Typography>
                  <Typography color={medium} fontSize="0.75rem">
                    {comment.location}
                  </Typography>
                  <Typography color={main} sx={{ mt: "0.5rem" }}>
                    {comment.comment}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
          <Divider />
          
          {/* Comment Input Section */}
          <Box p="1rem">
            <FlexBetween gap="1.5rem">
              <InputBase
                placeholder="Write a comment..."
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                sx={{
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "2rem",
                  padding: "1rem 2rem",
                }}
              />
              <Button
                disabled={!comment}
                onClick={handleComment}
                sx={{
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main,
                  borderRadius: "3rem",
                  padding: "0.5rem 2rem",
                  "&:hover": {
                    backgroundColor: palette.primary.dark,
                  },
                  "&:disabled": {
                    backgroundColor: palette.neutral.light,
                    color: palette.neutral.main,
                  },
                }}
              >
                Post
              </Button>
            </FlexBetween>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;