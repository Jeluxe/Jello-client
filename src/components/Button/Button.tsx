import "./Button.css"

type Props = {
  className?: string,
  size?: number,
  style?: any,
  title: any,
  onClick: (e: any) => void,
}
const Button = ({ className, size, style, title, onClick }: Props) => {
  return (
    <button className={className} style={{ width: size, height: size, ...style }} onClick={onClick}>{title}</button>
  )
}

export default Button