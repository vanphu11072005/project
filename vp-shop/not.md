1. useDispatch
    - mặc định kiểu trả về là any (hoặc Dispatch<AnyAction>). Nó không biết về async thunk của bạn.
        --> TS sẽ không gợi ý chính xác khi bạn dispatch(fetchProducts(...)).
    👉 useAppDispatch = useDispatch nhưng có kiểu chuẩn 
        → nhận biết thunk, action.

2. useSelector 
    - mặc định cũng không biết state của store có gì.
        --> Bạn viết state.products thì TS không chắc products có tồn tại không, nên autocomplete yếu + dễ sai.
    👉 useAppSelector = useSelector nhưng có RootState 
        → biết store có những slice nào.

3. const dispatch = useAppDispatch();
    dispatch là gì?
    - dispatch là hàm đặc biệt của Redux Store.
    - Công việc của nó: gửi action vào Store để thay đổi state.
    - Action = 1 object hoặc 1 function async (như createAsyncThunk).
    👉 Bạn có thể hiểu:
    - dispatch = “người đưa thư”.
    - Action = “lá thư chứa yêu cầu”.
    - Store = “bưu điện” nhận thư và xử lý.

4. useLocation
    - Là hook của react-route-dom, trả về 1 object chứa thông tin về địa chỉ URL hiện tại
    - Khi URL thay đổi (do navigate hoặc user gõ tay), component dùng useLocation sẽ re-render.
    👉 useLocation → để đọc URL hiện tại.

5. res.data
    - Là payload (data từ backend)
