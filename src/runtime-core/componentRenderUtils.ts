export function shouldUpdateComponent(prevVNode, nextVNode) {
  const { props: prevProps } = prevVNode;
  const { props: nextProps } = nextVNode;
  if (prevProps === nextProps) {
    return false;
  }

  if (!prevProps) {
    return !!nextProps;
  }
  if (!nextProps) {
    return true;
  }
}
