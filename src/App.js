import styled from '@emotion/styled'
import { useState } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin-top: 20px;
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 8px;
`

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`
const Result = styled.div`
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  width: 300px;
`

export default function App() {

  const [url, setUrl] = useState("");
  const [urlList, setUrlList] = useState([]);
async function shortenURL(url) {
  try {
    const res = await fetch("http://localhost:3001/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    return data.short;
  } catch (error) {
    console.error("Error shortening URL:", error);
  }
}
  const handdleSubmit = async (e) => {
    e.preventDefault();
    const shortUrl = await shortenURL(url);
    setUrlList([...urlList, { original: url, short: shortUrl }]);
    setUrl("");
  }
  return (
    <Container>
      <h1>URL Shortener</h1>
      <Form onSubmit={handdleSubmit}>
        <Input 
        type="text" 
        placeholder="Enter URL to shorten" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        />
        <Button type="submit">Shorten</Button>
      </Form>
      {urlList.map((item, index) => (
        <Result key={index}>
          <p>Original: {item.original}</p>
          <p>Shortened: {item.short}</p>
        </Result>
      ))}
    </Container>
  )
}


