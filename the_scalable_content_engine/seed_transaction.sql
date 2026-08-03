-- A transaction prevents partial seed data and orphaned relationships if any insert fails.
USE content_engine_db;
START TRANSACTION;

INSERT INTO users (id, username, email, bio) VALUES
(101, 'tx_ada', 'tx.ada@example.com', 'Transaction seed author.'),
(102, 'tx_kwame', 'tx.kwame@example.com', 'Cloud author.'),
(103, 'tx_lina', 'tx.lina@example.com', 'Design author.'),
(104, 'tx_sam', 'tx.sam@example.com', 'Data author.'),
(105, 'tx_nia', 'tx.nia@example.com', 'DevOps author.'),
(106, 'tx_omar', 'tx.omar@example.com', 'Security author.'),
(107, 'tx_zuri', 'tx.zuri@example.com', 'Mobile author.'),
(108, 'tx_theo', 'tx.theo@example.com', 'Testing author.'),
(109, 'tx_mei', 'tx.mei@example.com', 'Frontend author.'),
(110, 'tx_lucas', 'tx.lucas@example.com', 'Database author.');

INSERT INTO tags (id, name) VALUES
(101, 'transactions'),
(102, 'architecture'),
(103, 'performance'),
(104, 'quality'),
(105, 'cloud'),
(106, 'design'),
(107, 'analytics'),
(108, 'operations'),
(109, 'privacy'),
(110, 'observability');

INSERT INTO posts (id, title, content, user_id, status) VALUES
(101, 'Atomic Seeds', 'Why database seeds should be atomic.', 101, 'published'),
(102, 'Service Boundaries', 'Finding useful module boundaries.', 102, 'published'),
(103, 'Inclusive Defaults', 'Accessibility starts with defaults.', 103, 'published'),
(104, 'Reliable Metrics', 'Validating data before decisions.', 104, 'published'),
(105, 'Release Automation', 'Building repeatable release steps.', 105, 'published'),
(106, 'Security Reviews', 'Reviewing changes proportionally.', 106, 'published'),
(107, 'Mobile Sync', 'Conflict-aware offline synchronization.', 107, 'draft'),
(108, 'Test Design', 'Tests that explain behavior.', 108, 'published'),
(109, 'Fast Interfaces', 'Performance as a product feature.', 109, 'published'),
(110, 'Useful Indexes', 'Index from observed access patterns.', 110, 'published'),
(111, 'Rollback Practice', 'Rehearse recovery before incidents.', 105, 'draft'),
(112, 'Private by Design', 'Minimize sensitive data collection.', 106, 'published'),
(113, 'Traceable Analysis', 'Reproduce every analytical result.', 104, 'published'),
(114, 'Design Systems', 'Reusable accessible interface rules.', 103, 'published'),
(115, 'Cloud Guardrails', 'Set budgets before scaling.', 102, 'published');

INSERT INTO comments (id, body, user_id, post_id) VALUES
(101, 'This is a clear transaction example.', 102, 101),
(102, 'Boundaries should follow change patterns.', 103, 102),
(103, 'Defaults shape every user experience.', 104, 103),
(104, 'Validation belongs close to ingestion.', 105, 104),
(105, 'Repeatability reduced our release risk.', 106, 105),
(106, 'Risk-based review keeps work focused.', 107, 106),
(107, 'Conflict tests are essential.', 108, 107),
(108, 'Readable tests are living documentation.', 109, 108),
(109, 'Budgets make regressions visible.', 110, 109),
(110, 'Measure first, then index.', 101, 110),
(111, 'Recovery drills build confidence.', 102, 111),
(112, 'Data minimization lowers risk.', 103, 112),
(113, 'Recording versions is critical.', 104, 113),
(114, 'Tokens improve consistency.', 105, 114),
(115, 'Ownership tags support accountability.', 106, 115);

INSERT INTO post_tags (post_id, tag_id) VALUES
(101, 101),
(101, 104),
(102, 102),
(103, 106),
(104, 107),
(105, 108),
(105, 105),
(106, 109),
(107, 102),
(108, 104),
(109, 103),
(110, 103),
(111, 108),
(112, 109),
(113, 107),
(114, 106),
(115, 105),
(102, 110),
(104, 110),
(106, 104);

COMMIT;
