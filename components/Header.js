import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "../routes";

const Header = () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">Home</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/campaigns/new">
          <a className="item">
            <Icon name="add circle" size="large" />
            Create Campaign
          </a>
        </Link>

        <a href="https://github.com/monchoz" target="_blank" className="item">
          <Icon name="github" size="large" />
        </a>

        <a
          href="https://www.linkedin.com/in/monchoz/"
          target="_blank"
          className="item"
        >
          <Icon name="linkedin" size="large" />
        </a>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
