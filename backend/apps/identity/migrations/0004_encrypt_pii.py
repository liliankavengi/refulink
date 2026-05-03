from django.db import migrations

import apps.security.fields


def encrypt_existing_records(apps, schema_editor):
    AlienID = apps.get_model("identity", "AlienID")

    for record in AlienID.objects.all().iterator():
        record.save(
            update_fields=[
                "id_number",
                "rin",
                "first_name",
                "last_name",
                "date_of_birth",
            ]
        )


class Migration(migrations.Migration):

    dependencies = [
        ("identity", "0003_refugeeidentity"),
    ]

    operations = [
        migrations.AlterField(
            model_name="alienid",
            name="id_number",
            field=apps.security.fields.EncryptedTextField(
                db_index=True,
                help_text="The Alien ID card number (e.g., 123456)",
                unique=True,
            ),
        ),
        migrations.AlterField(
            model_name="alienid",
            name="rin",
            field=apps.security.fields.EncryptedTextField(
                blank=True,
                max_length=20,
                null=True,
                unique=True,
            ),
        ),
        migrations.AlterField(
            model_name="alienid",
            name="first_name",
            field=apps.security.fields.EncryptedTextField(
                blank=True,
                max_length=100,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="alienid",
            name="last_name",
            field=apps.security.fields.EncryptedTextField(
                blank=True,
                max_length=100,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="alienid",
            name="date_of_birth",
            field=apps.security.fields.EncryptedDateField(
                blank=True,
                null=True,
            ),
        ),
        migrations.RunPython(encrypt_existing_records, migrations.RunPython.noop),
    ]