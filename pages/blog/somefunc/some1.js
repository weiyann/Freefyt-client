import styles from '@/styles/blog/hey2.module.css'

import Card from "@/components/blog/somefunc/card";

export default function App() {
  const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
  return (
    <>
    <div  className={styles['aaa']}></div>
    <div  className={styles['bbb']}>
    <div  className={styles['App']}>
      {items.map((item, i) => (
        <Card key={i} text={item} index={i} />
      ))}
    </div>
    </div>
    
       
    </>
    
  );
}
