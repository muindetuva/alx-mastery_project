USE content_engine_db;

-- All published posts with their author's username, newest first.
SELECT p.id, p.title, u.username, p.created_at
FROM posts AS p
INNER JOIN users AS u ON u.id = p.user_id
WHERE p.status = 'published'
ORDER BY p.created_at DESC;

-- All users and their post count, including users with no posts.
SELECT u.id, u.username, COUNT(p.id) AS post_count
FROM users AS u
LEFT JOIN posts AS p ON p.user_id = u.id
GROUP BY u.id, u.username
ORDER BY u.username;

-- All comments on post 1 with each commenter's username.
SELECT c.id, c.body, u.username, c.created_at
FROM comments AS c
INNER JOIN users AS u ON u.id = c.user_id
WHERE c.post_id = 1
ORDER BY c.created_at;

-- All posts with each assigned tag.
SELECT p.id, p.title, t.name AS tag_name
FROM posts AS p
INNER JOIN post_tags AS pt ON pt.post_id = p.id
INNER JOIN tags AS t ON t.id = pt.tag_id
ORDER BY p.id, t.name;

-- All posts that have no tags assigned.
SELECT p.id, p.title
FROM posts AS p
LEFT JOIN post_tags AS pt ON pt.post_id = p.id
WHERE pt.post_id IS NULL;
