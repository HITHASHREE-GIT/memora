class ConversationService:
    def __init__(self):
        self.context = {}

    def update_context(self, person_data: dict):
        self.context = person_data

    def get_context(self):
        return self.context

    def clear_context(self):
        self.context = {}

conversation_service = ConversationService()