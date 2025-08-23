CREATE OR REPLACE FUNCTION get_blogs_by_author(_author_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', b.id,
        'title', b.title,
        'slug', b.slug,
        'view', COALESCE(v.view_count, 0),
        'like', COALESCE(l.like_count, 0),
        'comments', COALESCE(c.comment_count, 0),
        'created_at', b.created_at,
        'status', b.status
      )
      ORDER BY b.created_at DESC
    ),
    '[]'::jsonb
  )
  FROM blog b
  LEFT JOIN LATERAL (
    SELECT count(*)::bigint AS like_count
    FROM blog_like bl
    WHERE bl.blog_id = b.id
  ) l ON true
  LEFT JOIN LATERAL (
    SELECT count(*)::bigint AS comment_count
    FROM blog_comment bc
    WHERE bc.blog_id = b.id
  ) c ON true
  LEFT JOIN LATERAL (
    SELECT count(*)::bigint AS view_count
    FROM blog_view bv 
    WHERE bv.blog_id = b.id
  ) v ON true
  WHERE b.author_id = _author_id;
$$;