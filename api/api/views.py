from rest_framework import generics, permissions
from .models import ConstructionRequest,CaseStudies,ChatMessage,UserAccount,ChatMessageAttachment
from .serializers import ConstructionRequestSerializer,CaseStudiesSerializer,ChatMessageAttachmentSerializer,ChatMessageSerializer,UserAccountSerializer,UnrepliedMessagesSerializer
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count

class NonAdminUserListView(generics.ListAPIView):
    queryset = UserAccount.objects.filter(is_staff=False)
    serializer_class = UserAccountSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Retrieve unreplied message counts for each user
        users_with_unreplied_messages = []
        for user in queryset:
            num_unreplied_messages = ChatMessage.objects.filter(
                sender=user,
                parent_message__isnull=True
            ).annotate(num_replies=Count('chatmessage')).filter(num_replies=0).count()

            user_data = {
                'user_id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone': user.phone,
                'adress': user.adress,
                'is_superuser': user.is_superuser,
                'num_unreplied_messages': num_unreplied_messages
            }
            users_with_unreplied_messages.append(user_data)

        serializer = UnrepliedMessagesSerializer(users_with_unreplied_messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ConstructionRequestListCreateView(generics.ListCreateAPIView):
    queryset = ConstructionRequest.objects.all()
    serializer_class = ConstructionRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ConstructionRequestRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ConstructionRequest.objects.all()
    serializer_class = ConstructionRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = get_object_or_404(ConstructionRequest, pk=self.kwargs['pk'], user=self.request.user)
        return obj

class CaseStudiesList(generics.ListCreateAPIView):
    queryset = CaseStudies.objects.all()
    serializer_class = CaseStudiesSerializer

class CaseStudiesDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CaseStudies.objects.all()
    serializer_class = CaseStudiesSerializer

class ChatMessageListCreateView(generics.ListCreateAPIView):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        # Include attachments in the queryset when retrieving chat messages
        return ChatMessage.objects.prefetch_related('attachments')

    def perform_create(self, serializer):
        parent_id = self.request.data.get('parent_message')
        parent_message = ChatMessage.objects.filter(id=parent_id).first() if parent_id else None
        attachments_data = self.request.data.get('attachments', [])  # Get attachments data from request

        # Check if any attachments are provided
        if attachments_data:
            attachments_serializers = [ChatMessageAttachmentSerializer(data=data) for data in attachments_data]

            # Validate all attachment serializers
            valid_attachments = [attachment_serializer.is_valid() for attachment_serializer in attachments_serializers]

            # Check if all attachment data is valid
            if all(valid_attachments):
                serializer.save(sender=self.request.user, parent_message=parent_message)

                # Create attachments after saving the chat message
                for attachment_serializer in attachments_serializers:
                    attachment_serializer.is_valid()  # Re-validate before saving
                    ChatMessageAttachment.objects.create(
                        chat_message=serializer.instance,
                        **attachment_serializer.validated_data
                    )
            else:
                # If any attachment data is invalid, return a 400 Bad Request response
                invalid_attachments = [
                    data for data, valid in zip(attachments_data, valid_attachments) if not valid
                ]
                return Response({'attachments': invalid_attachments}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If no attachments are provided, save the chat message without attachments
            serializer.save(sender=self.request.user, parent_message=parent_message)


    