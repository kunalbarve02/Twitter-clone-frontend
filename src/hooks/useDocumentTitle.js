import {useEffect} from 'react'

function useDocumentTitle(string) {
    useEffect(() => {
        document.title = string
    },[string])
}

export default useDocumentTitle