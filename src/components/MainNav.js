import { readToken, removeToken } from '@/lib/authenticate';
import { addToHistory } from '@/lib/userData';
import { searchHistoryAtom } from '@/store';
import { useSetAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function MainNav() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const setSearchHistory = useSetAtom(searchHistoryAtom);

  let token = readToken();

  function logout() {
    setIsExpanded(false);
    removeToken();
    router.push('/login');
  }

  return (
    <>
      <Navbar
        data-bs-theme="dark"
        expand="lg"
        expanded={isExpanded}
        className="bg-body-tertiary fixed-top">
        <Container fluid>
          <Navbar.Brand>Irish Banga</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link active={router.pathname === '/'} onClick={() => setIsExpanded(false)}>
                  Home
                </Nav.Link>
              </Link>
              {token && (
                <Link href="/search" passHref legacyBehavior>
                  <Nav.Link
                    active={router.pathname === '/search'}
                    onClick={() => setIsExpanded(false)}>
                    Advanced Search
                  </Nav.Link>
                </Link>
              )}
            </Nav>
            {token && (
              <>
                <Form
                  className="d-flex"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    router.push(`/artwork?title=true&q=${searchQuery}`);
                    setIsExpanded(false);
                    setSearchHistory(await addToHistory(`title=true&q=${searchQuery}`));
                  }}>
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    value={searchQuery}
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="outline-success">
                    Search
                  </Button>
                </Form>
                <Nav>
                  <NavDropdown title={token.userName} id="basic-nav-dropdown" align={{ lg: 'end' }}>
                    <Link href="/favourites" passHref legacyBehavior>
                      <NavDropdown.Item onClick={() => setIsExpanded(false)}>
                        Favourites
                      </NavDropdown.Item>
                    </Link>
                    <Link href="/history" passHref legacyBehavior>
                      <NavDropdown.Item onClick={() => setIsExpanded(false)}>
                        Search History
                      </NavDropdown.Item>
                    </Link>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
            )}
            {!token && (
              <Nav>
                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link
                    active={router.pathname === '/register'}
                    onClick={() => setIsExpanded(false)}>
                    Register
                  </Nav.Link>
                </Link>
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link
                    active={router.pathname === '/login'}
                    onClick={() => setIsExpanded(false)}>
                    Login
                  </Nav.Link>
                </Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </>
  );
}
