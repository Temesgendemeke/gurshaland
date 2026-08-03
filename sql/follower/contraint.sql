ALTER TABLE follower
ADD CONSTRAINT "check_no_self_follow"
CHECK (follower_id <> profile_id)