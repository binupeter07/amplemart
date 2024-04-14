import React, { useEffect, useState } from 'react';
import './ViewUsers.scss';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Link } from 'react-router-dom';
import Search from '../../search/Search';
import { Spinner } from '../../Loader/Loader';
import { shortenText } from '../../../utils/utils';
import { useDispatch } from 'react-redux';
import {
  getUsers,
  ChangeStatusUser,
  deleteUser,
} from '../../../redux/features/auth/authSlice';
import ReactPaginate from 'react-paginate';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  // Pagination settings
  const itemsPerPage = 6;
  const pageCount = Math.ceil(filteredUsers?.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredUsers?.slice(offset, offset + itemsPerPage);

  const fetchData = async () => {
    // Simulate API call or fetch data from backend
    setIsLoading(true);

    const data = await dispatch(getUsers());
    if (data.payload && Array.isArray(data.payload)) {
      setUsers(data.payload);
      setFilteredUsers(data.payload);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    filterUsers(e.target.value);
  };

  const filterUsers = (query) => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.phone.includes(query)
    );
    setFilteredUsers(filtered);
    setCurrentPage(0); // Reset to first page when filtering
  };

  const DeleteUser = async (id) => {
    await dispatch(deleteUser(id));
    fetchData();
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => DeleteUser(id),
        },
        {
          label: 'Cancel',
        },
      ],
    });
  };

  const toggleBlockUser = async (id) => {
    try {
      await dispatch(ChangeStatusUser(id));
      fetchData();
    } catch (error) {}
  };

  return (
    
    <div className="user-list">
              {/* {isLoading && <Spinner />} */}
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>All Users</h3>
            <p>
              ~ <b>{filteredUsers?.length} Users Found</b>
            </p>
          </span>
          <span>
            <Search value={search} onChange={handleSearchChange} />
          </span>
        </div>



        <div className="table">
          {!isLoading && currentItems.length === 0 ? (
            <p>-- No Users found...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{shortenText(user.name, 20)}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td className="icons">
                      <span className="icon-container">
                        <button
                          className={`block-btn ${
                            user.isBlocked ? 'blocked' : 'unblocked'
                          }`}
                          onClick={() => toggleBlockUser(user._id)}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </span>
                      <span
                        className="icon-container"
                        onClick={() => confirmDelete(user._id)}
                      >
                        <FaTrashAlt size={20} color={'red'} className="icon" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {pageCount > 1 && (
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="Prev"
            containerClassName="pagination"
            pageLinkClassName="page-num"
            previousLinkClassName="page-num"
            nextLinkClassName="page-num"
            activeClassName="activePage"
          />
        )}
      </div>
    </div>
  );
};

export default ViewUsers;
