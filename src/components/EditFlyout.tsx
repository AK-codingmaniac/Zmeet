import React, { useEffect, useState } from "react";
import { FieldErrorType, MeetingType, UserType } from "../app/utils/Types";
import useAuth from "../hooks/useAuth";
import useFetchUsers from "../hooks/useFetchUsers";
import moment from "moment";
import { doc, updateDoc } from "firebase/firestore";
import { firebaseDB } from "../app/utils/FirebaseConfig";
import useToast from "../hooks/useToast";
import { EuiFlyout, EuiFlyoutBody, EuiFlyoutHeader, EuiForm, EuiFormRow, EuiSpacer, EuiSwitch, EuiTitle } from "@elastic/eui";
import MeetingNameField from "./FormComponents/MeetingNameField";
import MeetingMaximumUserField from "./FormComponents/MeetingMaximumUserField";
import MeetingDateField from "./FormComponents/MeetingDateField";
import CreateMeetingButtons from "./FormComponents/CreateMeetingButtons";
import MeetingUsersField from "./FormComponents/MeetingUsersField";

function EditFlyout({
  closeFlyout,
  meetings,
}: {
  closeFlyout: any;
  meetings: MeetingType;
}) {
  useAuth();
  const { users } = useFetchUsers();
  const [createToast] = useToast();

  const [meetingName, setMeetingName] = useState(meetings.meetingName);
  const [selectedUsers, setSelectedUsers] = useState<Array<UserType>>([]);
  const [startDate, setStartDate] = useState(moment(meetings.meetingDate));
  const [size, setSize] = useState(1);
  const [status, setStatus] = useState(false);
  const [meetingType] = useState(meetings.meetingType);
  const [showErrors] = useState<{
    meetingName: FieldErrorType;
    meetingUser: FieldErrorType;
  }>({
    meetingName: {
      show: false,
      message: [],
    },
    meetingUser: {
      show: false,
      message: [],
    },
  });

  useEffect(() => {
    if (users) {
      const foundUsers: Array<UserType> = [];
      meetings.invitedUsers.forEach((user: string) => {
        const findUser = users.find(
          (tempUser: UserType) => tempUser.uid === user
        );
        if (findUser) foundUsers.push(findUser);
      });
      setSelectedUsers(foundUsers);
    }
  }, [meetings, users]);

  const onUserChange = (selectedOptions: any) => {
    setSelectedUsers(selectedOptions);
  };
  
  const editMeeting = async () => {
    const editedMeeting = {
      ...meetings,
      meetingName,
      meetingType,
      invitedUsers: selectedUsers.map((user: UserType) => user.uid),
      maxUsers: size,
      meetingDate: startDate.format("L"),
      status: !status,
    };
    delete editedMeeting.docId;
    const docRef = doc(firebaseDB, "meetings", meetings.docId!);
    await updateDoc(docRef, editedMeeting);
    createToast({ title: "Meeting updated successfully.", type: "success" });
    closeFlyout(true);
  };

  return (
    <EuiFlyout ownFocus onClose={() => closeFlyout()}>
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2>{meetings.meetingName}</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiForm>
          <MeetingNameField
            label="Meeting name"
            isInvalid={showErrors.meetingName.show}
            error={showErrors.meetingName.message}
            placeholder="Meeting name"
            value={meetingName}
            setMeetingName={setMeetingName}
          />
          {meetingType === "anyone-can-join" ? (
            <MeetingMaximumUserField value={size} setValue={setSize} />
          ) : (
            <MeetingUsersField
              label="Invite Users"
              isInvalid={showErrors.meetingUser.show}
              error={showErrors.meetingUser.message}
              options={users}
              onChange={onUserChange}
              selectedOptions={selectedUsers}
              singleSelection={
                meetingType === "1-on-1" ? { asPlainText: true } : false
              }
              isClearable={false}
              placeholder="Select a Users"
            />
          )}
          <MeetingDateField selected={startDate} setStartDate={setStartDate} />
          <EuiFormRow display="columnCompressedSwitch" label="Cancel Meeting">
            <EuiSwitch
              showLabel={false}
              label="Cancel Meeting"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
            />
          </EuiFormRow>
          <EuiSpacer />
          <CreateMeetingButtons
            createMeeting={editMeeting}
            isEdit
            closeFlyout={closeFlyout}
          />
        </EuiForm>
      </EuiFlyoutBody>
    </EuiFlyout>
  );
}

export default EditFlyout;
