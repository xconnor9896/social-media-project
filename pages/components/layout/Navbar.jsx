import { useRouter } from "next/router";
import Link from 'next/link';
import { Menu, Container, Icon } from "semantic-ui-react";

const Navbar = () => {
  const router = useRouter();
  const isActive = (route) => router.pathname === route; // You can place any route in the callback, then we know that said route is the one we're currently on
  return (
    <Menu fluid borderless>
      <Container text>
        <Link href="/login">
          <Menu.Item header active={isActive('/login')}>
            <Icon name='sign-in' size='large' />
            Log In
          </Menu.Item>
        </Link>
        <Link href="/signup">
          <Menu.Item header active={isActive('/signup')}>
            <Icon name='signup' size='large' />
            Sign Up
          </Menu.Item>
        </Link>
      </Container>
    </Menu>
  );
};

export default Navbar;
