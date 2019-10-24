<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:fn="http://www.w3.org/2005/xpath-functions"
  xmlns:n="urn:com-cerner-patient-ehr:v3"
  xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
  xmlns:dd="DynamicDocumentation"
  xmlns:java-string="java:java.lang.String"
  xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
  exclude-result-prefixes="xsl xs fn n cdocfx java-string xr-date-formatter">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

  <!-- Required to include CommonFxn.xslt -->
  <!-- Comment out this line to debug --><xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt"/>
  <!-- Uncomment this line to debug <xsl:include href="CommonFxn.xslt"/> -->

  <!-- Including Strings to be used -->
  <xsl:variable name="UnableToObtain" as="xs:string">
    <xsl:value-of select="'Unable to obtain social history'"/>
  </xsl:variable>

  <xsl:variable name="Assessments" as="xs:string">
    <xsl:value-of select="'%s, %s'"/>
  </xsl:variable>

  <xsl:variable name="Separator" as="xs:string">
    <xsl:value-of select="' - '"/>
  </xsl:variable>

  <xsl:variable name="DateSeparator" as="xs:string">
		<xsl:value-of select="', '"/>
  </xsl:variable>

  <xsl:variable name="SmokingStatus" as="xs:string">
    <xsl:value-of select="'Smoking Status'"/>
  </xsl:variable>

  <xsl:variable name="SmokingStatusSeparator" as="xs:string">
    <xsl:value-of select="'%s; '"/>
  </xsl:variable>

  <xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>

  <!-- Keys -->
  <xsl:key name="keyCategory" match="n:report/n:clinical-data/n:social-history-data/n:social-history-information/n:category-activity" use="@category-cd"/>
  <xsl:key name="keyNomenclature" match="n:report/n:nomenclature-list/n:nomenclature" use="@nomenclature-id"/>

  <!-- This template walks through a list of category-assessment's recursively and concatenates them
		 NOTE: This is necessary for when a patient combine merges two categories with different category assessments. -->
  <xsl:template name="RecurseCategoryAssessment">
    <xsl:param name="CategoryAssessmentList"/>
    <xsl:choose>
      <xsl:when test="count($CategoryAssessmentList) > 1">
        <xsl:variable name="RecursiveResult" as="xs:string">
          <xsl:call-template name="RecurseCategoryAssessment">
            <xsl:with-param name="CategoryAssessmentList" select="$CategoryAssessmentList[position() &gt; 1]"/>
          </xsl:call-template>
        </xsl:variable>
        <xsl:variable name="CategoryAssessmentDisplay" as="xs:string">
          <xsl:value-of select="cdocfx:getCodeDisplayByID($CategoryAssessmentList[1]/@assessment-code)"/>
        </xsl:variable>
        <xsl:value-of select="java-string:format($Assessments, ($CategoryAssessmentDisplay, $RecursiveResult))"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="cdocfx:getCodeDisplayByID($CategoryAssessmentList[1]/@assessment-code)"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Format a single social history item -->
  <!-- Parameters: -->
  <!--	categoryActivity - a single social history category activity -->
  <xsl:template name="tempFormatSocialHxItem">
    <xsl:param name="categoryActivity"/>
    <xsl:param name="updtDtTm"/>

    <xsl:variable name="statusCode">
      <xsl:choose>
        <xsl:when test="fn:count($categoryActivity/n:category-detail) &gt; 1">
          <xsl:value-of select="$categoryActivity/n:category-detail[1]/@status-code"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$categoryActivity/n:category-detail/@status-code"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <div class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
      <xsl:attribute name="dd:entityid">
        <xsl:value-of select="$categoryActivity/@category-cd"/>
      </xsl:attribute>
      <xsl:attribute name="dd:contenttype">
        <xsl:text>SOCIALHX</xsl:text>
      </xsl:attribute>

      <xsl:if test="fn:count($categoryActivity/@name) &gt; 0">
        <div>
          <span style="text-decoration:underline;">
            <xsl:value-of select="$categoryActivity/@name"/>
          </span>
          <xsl:if test="fn:count($categoryActivity/n:category-assessment) &gt; 0">
            <xsl:value-of select="$Separator"/>

            <!-- Assessment -->
            <xsl:call-template name="RecurseCategoryAssessment">
              <xsl:with-param name="CategoryAssessmentList" select="$categoryActivity/n:category-assessment"/>
            </xsl:call-template>
            <xsl:variable name="categoryAssessmentDtTm" as="xs:string">
              <xsl:value-of select="$categoryActivity/n:category-assessment/n:updt-dt-tm"></xsl:value-of>
            </xsl:variable>
            <!-- Only display date separator if Assessment exists -->
            <xsl:if test="$categoryAssessmentDtTm">
              <xsl:value-of select="$DateSeparator"/>
            </xsl:if>

            <!-- Display updt-dt-tm -->
            <xsl:if test="$categoryAssessmentDtTm">
              <xsl:variable name="updateDtTm" as="xs:dateTime" select="$categoryActivity/n:category-assessment/n:updt-dt-tm"/>
              <xsl:variable name="sTZ" as="xs:string" select="$updtDtTm/@time-zone"/><!-- time-zone is a required attribute. -->
              <xsl:variable name="sUpdateDtTm" as="xs:string" select="$categoryAssessmentDtTm"/><!-- This is used to test whether the date time is empty. Empty date time can cause an error to formatDate. -->
              <xsl:if test="$sUpdateDtTm != ''">
                <span>
                  <xsl:value-of select="xr-date-formatter:formatDate($updateDtTm, $DATE_ONLY_SEQUENCE, $sTZ, $current-locale)"/>
                </span>
              </xsl:if>
            </xsl:if>
          </xsl:if>
        </div>
      </xsl:if>

      <!-- Active documented categories-->
      <xsl:if test="fn:string-length($statusCode) &gt; 0 and cdocfx:getCodeMeanByID($statusCode)='ACTIVE'">
        <!-- Category Detail -->
        <xsl:if test="fn:count($categoryActivity/n:category-detail) &gt; 0">
          <xsl:for-each select="$categoryActivity/n:category-detail">
            <xsl:if test="@summary-text">
              <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right"  style="margin-left: 1em;">
                <xsl:variable name="categoryDetailDtTm" as="xs:string">
                  <xsl:value-of select="n:updt-dt-tm"/>
                </xsl:variable>
                <div>
                  <xsl:variable name="categoryDetailSummary">
                    <xsl:value-of select="@summary-text"/>
                  </xsl:variable>
                  <xsl:value-of select="$categoryDetailSummary"/>
                  <!-- display the date separator for the category detail -->
                  <xsl:if test="$categoryDetailDtTm">
                    <xsl:value-of select="$DateSeparator"/>
                  </xsl:if>
                  <!-- display the date for the category detail -->
                  <xsl:if test="$categoryDetailDtTm">
                    <xsl:variable name="updateDtTm" as="xs:dateTime" select="n:updt-dt-tm"/>
                    <xsl:variable name="sTZ" as="xs:string" select="$updtDtTm/@time-zone"/><!-- time-zone is a required attribute. -->
                    <xsl:variable name="sUpdateDtTm" as="xs:string" select="$categoryDetailDtTm"/><!-- This is used to test whether the date time is empty. Empty date time can cause an error to formatDate. -->
                    <xsl:if test="$sUpdateDtTm != ''">
                      <span>
                        
                        <xsl:value-of select="xr-date-formatter:formatDate($updateDtTm, $DATE_ONLY_SEQUENCE, $sTZ, $current-locale)"/>
                      </span>
                    </xsl:if>
                  </xsl:if>
                </div>
              </div>
            </xsl:if>
          </xsl:for-each>
        </xsl:if>
      </xsl:if>
    </div>
  </xsl:template>

  <!-- The main template -->
  <xsl:template match="/">

    <xsl:variable name="eventEndDtTmNode" select="n:report/n:clinical-data/n:social-history-clinical-event-data/n:ce-smoking-status/n:event-end-dt-tm"/>
    <!-- If Social History Clinical Event Data exists, display it first -->
    <xsl:choose>
      <xsl:when test="n:report/n:clinical-data/n:social-history-clinical-event-data/n:ce-smoking-status/n:code-values/n:code-value">
        <div class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right"  style="margin-left: 1em;">
          <xsl:attribute name="dd:entityid">
            <xsl:if test="n:report/n:clinical-data/n:social-history-clinical-event-data/n:ce-smoking-status/@event-id">
              <xsl:value-of select="n:report/n:clinical-data/n:social-history-clinical-event-data/n:ce-smoking-status/@event-id"/>
            </xsl:if>
          </xsl:attribute>
          <xsl:attribute name="dd:contenttype">
            <xsl:text>SOCIALHXCE</xsl:text>
          </xsl:attribute>

          <span style="text-decoration:underline;">
            <xsl:value-of select="$SmokingStatus"/>
          </span>

          <!-- Display event-end-dt-tm -->
          <xsl:if test="$eventEndDtTmNode">
            <xsl:variable name="eventEndDtTm" as="xs:dateTime" select="$eventEndDtTmNode"/>
            <xsl:variable name="sTZ" as="xs:string" select="$eventEndDtTmNode/@time-zone"/>
            <!-- time-zone is a required attribute. -->
            <xsl:variable name="sEventEndDtTm" as="xs:string" select="$eventEndDtTmNode"/>
            <!-- This is used to test whether the date time is empty. Empty date time can cause an error to formatDate. -->
            <xsl:if test="$sEventEndDtTm != ''">

              <xsl:value-of select="$Separator"/>
              <span>
                <xsl:value-of select="xr-date-formatter:formatDate($eventEndDtTm, $DATE_ONLY_SEQUENCE, $sTZ, $current-locale)"/>
              </span>
            </xsl:if>
          </xsl:if>

          <div style="margin-left: 1em;">
            <xsl:for-each select="n:report/n:clinical-data/n:social-history-clinical-event-data/n:ce-smoking-status/n:code-values/n:code-value">
              <xsl:sort select="@group-nbr"/>
              <xsl:sort select="@sequence-nbr"/>
              <xsl:variable name="Description" as="xs:string">
                <xsl:value-of select="key('keyNomenclature', n:nomenclature)/@description"/>
              </xsl:variable>
              <xsl:choose>
                <xsl:when test="position()!=last()">
                  <xsl:value-of select="java-string:format($SmokingStatusSeparator, $Description)"/>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:value-of select="$Description"/>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:for-each>
          </div>
        </div>
      </xsl:when>
      <xsl:otherwise>
        <xsl:if test="n:report/n:clinical-data/n:social-history-clinical-event-data/n:ce-smoking-status/@nomenclature-id">
          <xsl:variable name="NomenclatureId">
            <xsl:value-of select="n:report/n:clinical-data/n:social-history-clinical-event-data/n:ce-smoking-status/@nomenclature-id"/>
          </xsl:variable>

          <div class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right"  style="margin-left: 1em;">
            <xsl:attribute name="dd:entityid">
              <xsl:if test="n:report/n:clinical-data/n:social-history-clinical-event-data/n:ce-smoking-status/@event-id">
                <xsl:value-of select="n:report/n:clinical-data/n:social-history-clinical-event-data/n:ce-smoking-status/@event-id"/>
              </xsl:if>
            </xsl:attribute>
            <xsl:attribute name="dd:contenttype">
              <xsl:text>SOCIALHXCE</xsl:text>
            </xsl:attribute>

            <span style="text-decoration:underline;">
              <xsl:value-of select="$SmokingStatus"/>
            </span>

            <!-- Display event-end-dt-tm -->
            <xsl:if test="$eventEndDtTmNode">
              <xsl:variable name="eventEndDtTm" as="xs:dateTime" select="$eventEndDtTmNode"/>
              <xsl:variable name="sTZ" as="xs:string" select="$eventEndDtTmNode/@time-zone"/>
              <!-- time-zone is a required attribute. -->
              <xsl:variable name="sEventEndDtTm" as="xs:string" select="$eventEndDtTmNode"/>
              <!-- This is used to test whether the date time is empty. Empty date time can cause an error to formatDate. -->
              <xsl:if test="$sEventEndDtTm != ''">
                <xsl:value-of select="$Separator"/>
                <span>
                  <xsl:value-of select="xr-date-formatter:formatDate($eventEndDtTm, $DATE_ONLY_SEQUENCE, $sTZ, $current-locale)"/>
                </span>
              </xsl:if>
            </xsl:if>

            <div style="margin-left: 1em;">
              <xsl:value-of select="key('keyNomenclature',$NomenclatureId)/@description"/>
            </div>
          </div>
        </xsl:if>
      </xsl:otherwise>
    </xsl:choose>

    <!-- If Social History information is unable to obtain -->
    <xsl:if test="n:report/n:clinical-data/n:social-history-data/n:social-history-information[@unable-to-obtain='true']">
      <div>
        <xsl:value-of select="$UnableToObtain"/>
      </div>
    </xsl:if>

    <!-- Display the categories in alphebetical order -->
    <xsl:for-each select="n:report/n:clinical-data/n:social-history-data/n:social-history-information/n:category-activity">
      <!-- Sort alphabetically -->
      <xsl:sort select="fn:upper-case(cdocfx:get-clinical-display(@name, n:category-activity))"/>

      <xsl:call-template name="tempFormatSocialHxItem">
        <xsl:with-param name="categoryActivity" select="."/>
        <xsl:with-param name="updtDtTm" select="../n:updt-dt-tm" />
      </xsl:call-template>

    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>