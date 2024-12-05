import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";

// TODO: melhorar isso aqui
interface ControllerData {
  id: string;
}

class Controller<T extends ControllerData> {
  path: string;
  collectionRef: CollectionReference<DocumentData>;

  constructor(path: string) {
    this.path = path;
    this.collectionRef = collection(firestore, path);
  }

  async add(data: Omit<T, "id">): Promise<void> {
    await addDoc(this.collectionRef, data);
  }

  async find(dataId: string): Promise<T> {
    const docRef = doc(firestore, this.path, dataId);

    const docSnap = await getDoc(docRef);

    const id = docSnap.id;

    const data = docSnap.data();

    return { id, ...data } as T;
  }

  async findAll(): Promise<T[]> {
    const { docs } = await getDocs(this.collectionRef);

    return [...docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)];
  }

  async update(data: T): Promise<void> {
    const { id, ...rest } = data;

    const comandDoc = doc(firestore, this.path, id);

    await updateDoc(comandDoc, { id, ...rest });
  }

  async delete(dataId: string): Promise<void> {
    const dataDoc = doc(firestore, this.path, dataId);

    await deleteDoc(dataDoc);
  }
}

export default Controller;
