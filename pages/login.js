import { authenticateUser } from '@/lib/authenticate';
import { getFavourites, getHistory } from '@/lib/userData';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';

export default function Login() {
  const [warning, setWarning] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const setFavourites = useSetAtom(favouritesAtom);
  const setSearchHistory = useSetAtom(searchHistoryAtom);

  async function updateAtoms() {
    setFavourites(await getFavourites());
    setSearchHistory(await getHistory());
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await authenticateUser(user, password);
      await updateAtoms();
      router.push('/favourites');
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <>
      <Card bg="light">
        <Card.Body>
          <h2>Login</h2>
          Enter your login information below:
        </Card.Body>
      </Card>

      <br />

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>User:</Form.Label>
          <Form.Control
            type="text"
            value={user}
            id="userName"
            name="userName"
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        {warning && (
          <>
            <br />
            <Alert variant="danger">{warning}</Alert>
          </>
        )}

        <br />
        <Button variant="primary" className="pull-right" type="submit">
          Login
        </Button>
      </Form>
    </>
  );
}
