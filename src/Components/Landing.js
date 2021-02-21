import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { sizing, flexbox, spacing } from "@material-ui/system";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import image from "./image.jpg";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles({
  root: {
    height: "80vh",
  },
  boxImg: {
    background: ` url(${image}) no-repeat center`,
    minHeight: "40rem",
  },
  textField: {
    margin: "3px 0",
  },
  button: {
    margin: "20px 0",
  },
  hr: {
    border: 0,
    height: 0,
    borderTop: "1px solid rgba(0, 0, 0, 0.1)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  },
});

const Landing = () => {
  const classes = useStyles();

  return (
    <>
      <Box display="flex" width="70%" mx="auto" mt={8} className={classes.root}>
        <Box width="70%" className={classes.boxImg} />
        <Box width="30%" textAlign="center" p={3}>
          <Typography variant="h3">Zion</Typography>
          <form noValidate autoComplete="off">
            <Box display="flex" flexDirection="column">
              <TextField
                id="outlined-secondary"
                label="Email or Ph. no"
                variant="outlined"
                color="secondary"
                className={classes.textField}
              />
              <TextField
                id="outlined-secondary"
                label="Password"
                variant="outlined"
                color="secondary"
                className={classes.textField}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Log in
              </Button>
            </Box>
            <hr className={classes.hr} />
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
            >
              Sign Up
            </Button>
          </form>
          <Box>
            <Typography variant="h6" align="left">
              Create store
            </Typography>
            <Typography align="left">
              <ul style={{ padding: "0 15px" }}>
                <li>For your business</li>
                <li>Services</li>
                <li>And interact with buyers and sellers</li>
              </ul>
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            endIcon={<Icon>send</Icon>}
          >
            Skip to Store
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Landing;
