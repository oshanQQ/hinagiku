import Typography from "typography"
import theme from "typography-theme-github"

theme.googleFonts = [
  {
    name: "Noto+Sans+JP",
    styles: ["400"],
  },
]

theme.headerFontFamily = ["Noto Sans JP"]
theme.bodyFontFamily = ["Noto Sans JP"]

const typography = new Typography({ theme })
export default typography
