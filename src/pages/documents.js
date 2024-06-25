

import DocumentList from '../components/DocumentList';
import styles from '../components/Home.module.css';


const Documents = () => {
    return (
        <div className={styles.container}>
            <h1 className='myDoc'>Documents</h1>
            <DocumentList />
        </div>
    )
}
    
export default Documents;
