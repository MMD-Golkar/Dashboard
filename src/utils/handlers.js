export function handleRoleSelection(roleSelectionStatus , setRoleSelectionStatus) {
    setRoleSelectionStatus(!roleSelectionStatus);
}
export function handleRoleButtons(roleSelectionStatus , setRoleSelectionStatus , role , setRole){
    setRoleSelectionStatus(false);
    setRole(role);
    localStorage.setItem('userRole', role);
}
export function handleLoginSubmit(e){
     e.preventDefault()
}
export function handleUsernameChange(e , setUsername){
    const value = e.target.value;
    const filtered = value.replace(/[^a-zA-Z0-9_]/g, '');
    setUsername(filtered);
  };
