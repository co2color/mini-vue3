export function initProps(instance, rawProps) {
  const props = {}
  for (const key in rawProps)
    props[key] = rawProps[key]

  instance.props = props
}
