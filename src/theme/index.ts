import { defineStyleConfig, extendTheme } from "@chakra-ui/react";
import { modalTheme } from "./modal";

export const theme = extendTheme({
  colors: {
    blue: {
      100: "#BFDFF2",
      200: "#99CCE5",
      300: "#73B9D8",
      400: "#4CA6CB",
      50: "#E6F2FF",
      500: "#248DBE",
      600: "#1C6C95",
      700: "#15506C",
      800: "#0E3443",
      900: "#06191A",
    },
    gray: {
      100: "#E1E1E1",
      200: "#C7C7C7",
      300: "#ABABAB",
      400: "#8F8F8F",
      50: "#F5F5F5",
      500: "#737373",
      600: "#5B5B5B",
      700: "#424242",
      800: "#292929",
      900: "#0F0F0F",
    },
    green: {
      100: "#B2F0BE",
      200: "#9AE7B0",
      300: "#80ED99",
      400: "#69D38C",
      50: "#C7F9CC",
      500: "#57CC99",
      600: "#48B27D",
      700: "#38A3A5",
      800: "#298A8D",
      900: "#22577A",
    },
    red: {
      100: "#FFBFBF",
      200: "#FF9999",
      300: "#FF7373",
      400: "#FF4D4D",
      50: "#FFE5E6",
      500: "#FF2424",
      600: "#CC1C1C",
      700: "#991515",
      800: "#660E0E",
      900: "#330606",
    },
    yellow: {
      100: "#FFEB99",
      200: "#FFE066",
      300: "#FFD633",
      400: "#FFCC00",
      50: "#FFF5CC",
      500: "#E6B800",
      600: "#CC9F00",
      700: "#B28600",
      800: "#996C00",
      900: "#7F5200",
    },
  },
  components: {
    Button: {
      variants: {
        danger: {
          _hover: {
            bgColor: "#80000d",
          },
          bgColor: "#b30012",
          borderRadius: "md",
          color: "white",
        },
        primary: {
          _hover: {
            bgColor: "#298A8D",
          },
          bgColor: "#38A3A5",
          borderRadius: "md",
          color: "white",
        },
        secondary: {
          _hover: {
            bgColor: "#0fd751",
          },
          bgColor: "#28f06b",
          borderRadius: "md",
          color: "#15126d",
        },
      },
    },
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                color: "blue.600",
                transform: "scale(0.85) translateY(-21px)",
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              { transform: "scale(0.85) translateY(-21px)" },
            label: {
              backgroundColor: "white",
              color: "gray.600",
              left: 0,
              mx: 3,
              my: 2,
              pointerEvents: "none",
              position: "absolute",
              px: 1,
              top: 0,
              transformOrigin: "left top",
              zIndex: 2,
            },
          },
        },
      },
    },
    Input: {
      defaultProps: { focusBorderColor: "#4CA6CB" },
    },
    Modal: modalTheme,
    Switch: {
      defaultProps: { colorScheme: "blue" },
    },
    Tag: defineStyleConfig({
      variants: {
        outline: {
          container: {
            borderColor: "currentColor",
            borderWidth: "1px",
          },
        },
      },
    }),
    Textarea: {
      defaultProps: { focusBorderColor: "#4CA6CB" },
    },
  },
});
