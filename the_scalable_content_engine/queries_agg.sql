USE content_engine_db;

-- Top five authors by number of published posts.
SELECT u.id, u.username, COUNT(p.id) AS published_post_count
FROM users AS u
INNER JOIN posts AS p ON p.user_id = u.id AND p.status = 'published'
GROUP BY u.id, u.username
ORDER BY published_post_count DESC
LIMIT 5;

-- Average number of comments across every post, including zero-comment posts.
SELECT AVG(comment_count) AS average_comments_per_post
FROM (
    SELECT p.id, COUNT(c.id) AS comment_count
    FROM posts AS p
    LEFT JOIN comments AS c ON c.post_id = p.id
    GROUP BY p.id
) AS post_comment_counts;

-- Tags ordered by how many posts use each one.
SELECT t.id, t.name, COUNT(pt.post_id) AS usage_count
FROM tags AS t
LEFT JOIN post_tags AS pt ON pt.tag_id = t.id
GROUP BY t.id, t.name
ORDER BY usage_count DESC;

-- Users who have written more than five comments.
SELECT u.id, u.username, COUNT(c.id) AS comment_count
FROM users AS u
INNER JOIN comments AS c ON c.user_id = u.id
GROUP BY u.id, u.username
HAVING COUNT(c.id) > 5
ORDER BY comment_count DESC;

-- Posts whose comment count exceeds the average comment count per post.
SELECT p.id, p.title, COUNT(c.id) AS comment_count
FROM posts AS p
LEFT JOIN comments AS c ON c.post_id = p.id
GROUP BY p.id, p.title
HAVING COUNT(c.id) > (
    SELECT AVG(per_post.comment_count)
    FROM (
        SELECT p2.id, COUNT(c2.id) AS comment_count
        FROM posts AS p2
        LEFT JOIN comments AS c2 ON c2.post_id = p2.id
        GROUP BY p2.id
    ) AS per_post
)
ORDER BY comment_count DESC;
