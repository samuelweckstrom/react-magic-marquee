import React, { useEffect, useState } from 'react';
import { Marquee } from 'react-magic-marquee';
import './styles.css';

function* shuffle(arr): any {
  arr = [...arr];
  while (arr.length) yield arr.splice((Math.random() * arr.length) | 0, 1)[0];
}

export function App() {
  const imageContent = [
    'https://d2w9rnfcy7mm78.cloudfront.net/2555261/original_a2dfbcad743cbe4ddf850fd40fa50dd5.jpg?1534275881?bc=1',
    'https://d2w9rnfcy7mm78.cloudfront.net/13061152/original_d6997c76b5355e55f669446b93d98979.jpg?1630804490?bc=0',
    // 'https://d2w9rnfcy7mm78.cloudfront.net/2671826/original_0a3c3852b56939cc4af27b56cde36421.png?1536432003?bc=1',
    // 'https://d2w9rnfcy7mm78.cloudfront.net/10858165/original_2254c255b62b66b8d042ede0d051ee4e.jpg?1613931688?bc=0',
    // 'https://d2w9rnfcy7mm78.cloudfront.net/6475034/original_f8744f85089e570ff95902e97b17562f.png?1584438463?bc=0',
    // 'https://d2w9rnfcy7mm78.cloudfront.net/17404855/original_edee54aacc7afce5f62ff25424b40ff9.jpg?1659119834?bc=0',
    // 'https://d2w9rnfcy7mm78.cloudfront.net/599840/original_ca99227b2b13e5d85543437bf1bb7343.jpg?1461545289?bc=1',
  ];

  const textContent = ['foo', 'bar', 'baz', 'qux', 'foo', 'bar', 'baz', 'qux'];
  const [content, setContent] = useState<any>([]);

  useEffect(() => {
    const images = imageContent.map((imageUrl) => ({
      type: 'image',
      content: imageUrl,
    }));
    const text = textContent.map((text) => ({
      type: 'text',
      content: text,
    }));

    setContent(images);
  }, []);

  const handleAnimationEnd = () => {
    console.log('** handleAnimationEnd');
  };

  const handleAnimationIteration = () => {
    console.log('** handleAnimationIteration');
  };

  return (
    <div className="marquee">
      <h1>hello</h1>
      <div className="marquee-container">
        <Marquee
          animationDuration={120}
          pauseOnHover
          onAnimationEnd={handleAnimationEnd}
          onAnimationIteration={handleAnimationIteration}
          direction="left"
          content={content}
          className="marquee-override"
          textElementType="h1"
          transitionDuration={500}
          renderItem={(item) => (
            <div
              className={`item ${item.marked ? 'item--marked' : ''} ${
                item.isTransitioning ? 'item--delete' : ''
              }`}
              key={item.id}
            >
              <div className={`item-content`}>
                {item.type === 'image' && <img src={item.content} alt="" />}
                {item.type === 'text' && <h1>{item.content}</h1>}
              </div>
              <div className="item-controls">
                <button onClick={item.deleteItem}>❌</button>
                <button
                  onClick={() =>
                    item.marked
                      ? item.removeProperty('marked')
                      : item.setProperty('marked', true)
                  }
                >
                  {item.marked ? '☑️' : '✅'}
                </button>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
