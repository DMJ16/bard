import React from "react";
import { navigate } from "hookrouter";
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

export default function NavBar() {
  const handleComposeClick = () => {
    navigate("/composebard");
  };

  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h4'>🌲🍄🌳 Merkwood 🌳🍄🌲</Typography>

          <Button onClick={handleComposeClick}>
            <Typography variant='h4'>
              📚🎨🎥🎤 Compose a Bard 🎤🎥🎨📚
            </Typography>
          </Button>
          <IconButton>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
