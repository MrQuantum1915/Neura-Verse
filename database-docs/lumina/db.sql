-- Recursive CTE for fetching a branch from thread
CREATE OR REPLACE FUNCTION get_curr_branch_context(
  node_id uuid, 
  req_user_id uuid, 
  req_thread_id uuid
)
RETURNS TABLE(role text, content text) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE branch AS(
    SELECT 
        l.role,
        l.content, 
        l.parent_id,
        1 as depth --leaf=> depth = 1
    FROM lumina l
    WHERE 
        user_id=req_user_id 
        AND 
        thread_id=req_thread_id 
        AND 
        id=node_id

    UNION ALL
    
    -- Recursion
    SELECT 
        l.role,
        l.content,
        l.parent_id,
        b.depth+1
    FROM lumina l
    INNER JOIN branch b ON l.id=b.parent_id
    ) 
    SELECT b.role, b.content 
    FROM branch b 
    ORDER BY b.depth DESC;
END;
$$;