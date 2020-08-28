import React from "react";
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Grid,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

export default function NavBar() {
  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <Grid container direction='row' justify='space-between'>
            <Grid item>
              <Button href='/'>
                <Typography variant='h5'>🌲🍄🌳 Merkwood 🌳🍄🌲</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button href='/composebard'>
                <Typography variant='h5'>
                  📚🎨🎥🎤 Compose a Bard 🎤🎥🎨📚
                </Typography>
              </Button>
              <IconButton>
                <MenuIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}
