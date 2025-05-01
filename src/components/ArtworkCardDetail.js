import { addToFavourites, removeFromFavourites } from '@/lib/userData';
import { favouritesAtom } from '@/store';
import { useAtom } from 'jotai';
import Error from 'next/error';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import useSWR from 'swr';

export default function ArtworkCardDetail({ objectID }) {
  const { data, error } = useSWR(
    objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null
  );

  const [favourites, setFavourites] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favourites?.includes(objectID));
  }, [favourites]);

  async function favouritesClicked() {
    if (showAdded) setFavourites(await removeFromFavourites(objectID));
    else setFavourites(await addToFavourites(objectID));
    setShowAdded(!showAdded);
  }

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  return (
    <Card>
      {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
      <Card.Body>
        <Card.Title>{data.title || 'N/A'}</Card.Title>
        <Card.Text>
          <strong>Date: </strong>
          {data.objectDate || 'N/A'}
          <br />
          <strong>Classification: </strong>
          {data.classification || 'N/A'}
          <br />
          <strong>Medium: </strong>
          {data.medium || 'N/A'}
          <br />
          <br />
          <strong>Artist Name: </strong>
          {data.artistDisplayName ? (
            <>
              {data.artistDisplayName}
              {' ('}
              <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer">
                Wikidata
              </a>
              {')'}
            </>
          ) : (
            'N/A'
          )}
          <br />
          <strong>Credit Line: </strong>
          {data.creditLine || 'N/A'}
          <br />
          <strong>Dimensions: </strong>
          {data.dimensions || 'N/A'}
        </Card.Text>
        <Button variant={showAdded ? 'primary' : 'outline-primary'} onClick={favouritesClicked}>
          {showAdded ? '+ Favourite (added)' : '+ Favourite'}
        </Button>
      </Card.Body>
    </Card>
  );
}
