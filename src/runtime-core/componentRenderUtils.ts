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
  return hasPropsChanged(prevProps, nextProps);
}

function hasPropsChanged(prevProps, nextProps): boolean {
  // 依次对比每一个 props.key

  // 提前对比一下 length ，length 不一致肯定是需要更新的
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }

  // 只要现在的 prop 和之前的 prop 不一样那么就需要更新
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
