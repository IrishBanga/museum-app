import { removeFromHistory } from '@/lib/userData';
import { searchHistoryAtom } from '@/store';
import styles from '@/styles/Home.module.css';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import { Card } from 'react-bootstrap';

export default function History() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  if (!searchHistory) return null;

  let parsedHistory = [];
  searchHistory.forEach((h) => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  function historyClicked(e, index) {
    router.push(`/artwork?${searchHistory[index]}`);
  }

  async function removeHistoryClicked(e, index) {
    e.stopPropagation();
    setSearchHistory(await removeFromHistory(searchHistory[index]));
  }

  return (
    <>
      <br />
      <br />
      <Row className="gy-4">
        {parsedHistory?.length > 0 ? (
          <ListGroup>
            {parsedHistory.map((historyItem, index) => {
              return (
                <ListGroup.Item
                  className={styles.historyListItem}
                  key={index}
                  onClick={(e) => historyClicked(e, index)}>
                  {Object.keys(historyItem).map((key) => (
                    <>
                      {key}: <strong>{historyItem[key]}</strong>&nbsp;
                    </>
                  ))}
                  <Button
                    className="float-end"
                    variant="danger"
                    size="sm"
                    onClick={(e) => removeHistoryClicked(e, index)}>
                    &times;
                  </Button>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        ) : (
          <Col>
            <Card>
              <Card.Body>
                <h4>Nothing Here</h4>
                Try searching for some artwork!
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
}
