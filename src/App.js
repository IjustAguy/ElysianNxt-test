import styled from '@emotion/styled'
import { useState , useEffect} from 'react';

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

const ButtonDel = styled.button`
  background-color: #ff0000ff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #b30000ff;
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
  border: 2px solid #000000ff;
  border-radius: 8px;
  width: 300px;
`

export default function App() {

  const [url, setUrl] = useState("");
  const [urlList, setUrlList] = useState([]);
async function shortenURL(url) {
  try {
    const res = await fetch("https://elysiannxt-test.onrender.com/shorten", {
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
async function deleteURL(code) {
  try {
    await fetch(`https://elysiannxt-test.onrender.com/delete/${code}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting URL:", error);
  }
  setUrlList(urlList.filter((item) => item.code !== code));
}
  const handdleSubmit = async (e) => {
    e.preventDefault();
    const shortUrl = await shortenURL(url);
    setUrlList([...urlList, { original: url, code: shortUrl.split('/').pop() }]);
    setUrl("");
  }

  useEffect(() => {
    fetch("https://elysiannxt-test.onrender.com/list")
      .then((res) => res.json())
      .then((data) => setUrlList(data))
      .catch((err) => console.error("Error loading URLs:", err));
  }, []);

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
          <p>Shortened: https://elysiannxt-test.onrender.com/{item.code}</p>
          <ButtonDel onClick={() => deleteURL(item.code)}>Delete</ButtonDel>
        </Result>
      ))}
    </Container>
  )
}


